"""Week 4, source slides 47–50. Python 3.12+, Django 5.2.x, SQLite.

Install: python -m pip install "Django>=5.2,<5.3"
Run:     python django_product_demo.py
Uses only a temporary in-memory database; no server or external service.
"""
from decimal import Decimal

from django.conf import settings

settings.configure(
    INSTALLED_APPS=[],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.AutoField",
)
import django

django.setup()

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import IntegrityError, connection, models, transaction


class Product(models.Model):
    name = models.CharField(max_length=80)
    price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0"))],
    )
    discount = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=Decimal("0"),
        validators=[MinValueValidator(Decimal("0"))],
    )

    @property
    def final_price(self):
        return self.price - self.discount

    def clean(self):
        super().clean()
        values = (self.price, self.discount)
        if not all(isinstance(v, Decimal) and v.is_finite() for v in values):
            return
        if self.discount > self.price:
            raise ValidationError({"discount": "discount exceeds price"})

    class Meta:
        app_label = "week4_demo"
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(price__gte=0)
                    & models.Q(discount__gte=0)
                    & models.Q(discount__lte=models.F("price"))
                ),
                name="product_valid_discount",
            )
        ]


def main():
    with connection.schema_editor() as schema_editor:
        schema_editor.create_model(Product)

    p = Product(name="Keyboard", price=Decimal("100.00"), discount=Decimal("20.00"))
    p.full_clean()
    p.save()
    print(p.final_price)
    assert p.final_price == Decimal("80.00")

    p.discount = Decimal("150.00")
    try:
        p.full_clean()
    except ValidationError:
        print("ValidationError")
    else:
        raise AssertionError("An invalid discount must fail model validation")
    print(p.discount)
    assert p.discount == Decimal("150.00")
    p.refresh_from_db()
    print(p.discount)
    assert p.discount == Decimal("20.00")

    # update() bypasses model validation, but not the database constraint.
    try:
        with transaction.atomic():
            Product.objects.filter(pk=p.pk).update(discount=Decimal("150.00"))
    except IntegrityError:
        print("IntegrityError")
    else:
        raise AssertionError("The database must reject an invalid discount")
    p.refresh_from_db()
    assert p.discount == Decimal("20.00")
    print("Database state preserved:", p.discount)
    print("All Django contract checks passed.")


if __name__ == "__main__":
    main()
