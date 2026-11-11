"""Offline behavior tests. All external calls are mocked."""
from types import SimpleNamespace as NS
from unittest.mock import Mock, patch
from django.test import SimpleTestCase, Client, override_settings
import httpx
import openai
import requests
from mysite.ai.common import AIError, checked_text, require_key
from mysite.ai.ollama import build_payload, extract_content, request_ollama, send_local_request
from mysite.ai.openai_provider import OpenAIProvider, create_response, response_text
from mysite.ai.nvidia_provider import NvidiaProvider, completion_text
from mysite.ai.registry import get_provider
from mysite.ai.sdk_common import sdk_error

@override_settings(ALLOWED_HOSTS=['testserver','localhost','127.0.0.1'],OPENAI_API_KEY='mock-only',NVIDIA_API_KEY='mock-only')
class ExampleTests(SimpleTestCase):
    def test_get_does_not_call_provider(self):
        with patch('mysite.views.get_provider') as provider:
            self.assertEqual(self.client.get('/ai/').status_code,200)
            provider.assert_not_called()

    def test_invalid_input_never_calls(self):
        for provider,prompt in [('ollama','  '),('ollama','a'*2001),('unknown','hello')]:
            with self.subTest(provider=provider,length=len(prompt)), patch('mysite.views.get_provider') as get:
                self.assertEqual(self.client.post('/ai/',{'provider':provider,'prompt':prompt}).status_code,200)
                get.assert_not_called()

    def test_answer_is_escaped_and_not_cached(self):
        with patch('mysite.views.get_provider') as get:
            get.return_value.generate.return_value='<script>alert(1)</script>\nhello'
            response=self.client.post('/ai/',{'provider':'ollama','prompt':' hello '})
            self.assertContains(response,'&lt;script&gt;')
            self.assertNotContains(response,'<script>')
            self.assertIn('no-store',response['Cache-Control'])
            get.return_value.generate.assert_called_once_with('hello')

    def test_csrf_required(self):
        client=Client(enforce_csrf_checks=True)
        with patch('mysite.views.get_provider') as get:
            self.assertEqual(client.post('/ai/',{'provider':'ollama','prompt':'hello'}).status_code,403)
            get.assert_not_called()
        client.get('/ai/')
        with patch('mysite.views.get_provider') as get:
            get.return_value.generate.return_value='ok'
            response=client.post('/ai/',{'provider':'ollama','prompt':'hello','csrfmiddlewaretoken':client.cookies['csrftoken'].value})
            self.assertEqual(response.status_code,200)
            get.return_value.generate.assert_called_once()

    def test_put_rejected(self):
        self.assertEqual(self.client.put('/ai/').status_code,405)

    def test_provider_error_becomes_form_error(self):
        with patch('mysite.views.get_provider') as get:
            get.return_value.generate.side_effect=AIError('timeout','Friendly timeout')
            self.assertContains(self.client.post('/ai/',{'provider':'ollama','prompt':'hello'}),'Friendly timeout')

    def test_allowlist(self):
        for name in ['ollama','openai','nvidia']:self.assertTrue(callable(get_provider(name).generate))
        for name in ['https://example.com','__import__','other']:
            with self.assertRaises(AIError):get_provider(name)

    def test_text_and_keys(self):
        self.assertEqual(checked_text(' hello '),'hello')
        for value in ['',None,{},'a'*20001]:
            with self.assertRaises(AIError):checked_text(value)
        with self.assertRaises(AIError):require_key('', 'OpenAI')

    def test_ollama_payload_and_model_allowlist(self):
        payload=build_payload('hello')
        self.assertIs(payload['stream'],False)
        self.assertEqual(payload['messages'][-1]['content'],'hello')
        with override_settings(OLLAMA_MODEL='unapproved-cloud-model'),self.assertRaises(AIError):build_payload('hello')

    def test_ollama_transport_controls(self):
        with patch('mysite.ai.ollama.requests.Session') as session:
            client=session.return_value.__enter__.return_value
            response=client.post.return_value;response.status_code=200;response.json.return_value={'done':True}
            self.assertEqual(send_local_request({'stream':False}),{'done':True})
            self.assertIs(client.trust_env,False)
            self.assertEqual(client.post.call_args.kwargs['timeout'],(3.05,120))
            self.assertIs(client.post.call_args.kwargs['allow_redirects'],False)

    def test_ollama_errors(self):
        cases=[(requests.exceptions.Timeout(),'timeout'),(requests.exceptions.ConnectionError(),'connection'),(requests.exceptions.HTTPError(),'http'),(requests.exceptions.JSONDecodeError('bad','x',0),'json')]
        for exc,code in cases:
            with self.subTest(code=code),patch('mysite.ai.ollama.send_local_request',side_effect=exc),self.assertRaises(AIError) as caught:request_ollama({})
            self.assertEqual(caught.exception.code,code)

    def test_ollama_response(self):
        self.assertEqual(extract_content({'done':True,'message':{'content':'hello'}}),'hello')
        for value in [{},{'done':False,'message':{'content':'hi'}},{'done':True,'done_reason':'length','message':{'content':'hi'}},{'done':True,'message':{'content':''}}]:
            with self.assertRaises(AIError):extract_content(value)

    def test_openai_payload(self):
        client=Mock();create_response(client,'hello')
        opts=client.responses.create.call_args.kwargs
        self.assertIs(opts['store'],False)
        self.assertIs(opts['stream'],False)
        self.assertEqual(opts['input'],'hello')
        self.assertEqual(opts['max_output_tokens'],600)

    def test_response_parsers(self):
        self.assertEqual(response_text(NS(status='completed',output_text=' hi ')),'hi')
        with self.assertRaises(AIError):response_text(NS(status='incomplete',output_text='hi'))
        self.assertEqual(completion_text(NS(choices=[NS(finish_reason='stop',message=NS(content='hello'))])),'hello')
        with self.assertRaises(AIError):completion_text(NS(choices=[]))
        with self.assertRaises(AIError):completion_text(NS(choices=[NS(finish_reason='length')]))

    def test_sdk_status_mapping(self):
        for status,code in [(401,'auth'),(403,'auth'),(404,'model'),(429,'rate_limit'),(500,'api')]:
            response=httpx.Response(status,request=httpx.Request('POST','https://example.invalid'))
            self.assertEqual(sdk_error(openai.APIStatusError('hidden',response=response,body=None)).code,code)

    def test_both_cloud_providers_are_mocked(self):
        with patch('mysite.ai.openai_provider.make_client') as factory:
            client=factory.return_value.__enter__.return_value
            client.responses.create.return_value=NS(status='completed',output_text='mock OpenAI')
            self.assertEqual(OpenAIProvider().generate('hello'),'mock OpenAI')
        with patch('mysite.ai.nvidia_provider.make_client') as factory:
            client=factory.return_value.__enter__.return_value
            client.chat.completions.create.return_value=NS(choices=[NS(finish_reason='stop',message=NS(content='mock NVIDIA'))])
            self.assertEqual(NvidiaProvider().generate('hello'),'mock NVIDIA')
