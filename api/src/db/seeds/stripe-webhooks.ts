import { faker } from "@faker-js/faker";
import { db } from "../index";
import { webhooks } from "../schema";

// Stripe webhook events
const STRIPE_EVENTS = [
  "charge.captured",
  "charge.expired",
  "charge.failed",
  "charge.pending",
  "charge.refunded",
  "charge.succeeded",
  "charge.updated",
  "customer.created",
  "customer.deleted",
  "customer.updated",
  "payment_intent.amount_capturable_updated",
  "payment_intent.canceled",
  "payment_intent.created",
  "payment_intent.payment_failed",
  "payment_intent.succeeded",
  "invoice.created",
  "invoice.deleted",
  "invoice.finalized",
  "invoice.paid",
  "invoice.payment_failed",
];

// Stripe webhook headers
const getStripeHeaders = () => ({
  "stripe-signature":
    "t=1614556800,v1=5c9b2c8e0f5c9b2c8e0f5c9b2c8e0f5c9b2c8e0f5c9b2c8e0f5c9b2c8e0f5c9b",
  "user-agent": "Stripe/1.0 (+https://www.stripe.com)",
  "content-type": "application/json",
  host: "api.stripe.com",
});

// Generate fake Stripe webhook body
const generateStripeEvent = (type: string) => {
  const customerId = `cus_${faker.string.alphanumeric(14).toUpperCase()}`;
  const chargeId = `ch_${faker.string.alphanumeric(24).toUpperCase()}`;
  const paymentIntentId = `pi_${faker.string.alphanumeric(24).toUpperCase()}`;
  const invoiceId = `in_${faker.string.alphanumeric(14).toUpperCase()}`;

  const baseEvent = {
    id: `evt_${faker.string.alphanumeric(24).toUpperCase()}`,
    object: "event",
    api_version: "2023-10-16",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {},
      previous_attributes: {},
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: null,
      idempotency_key: null,
    },
    type,
  };

  // Add specific data based on event type
  if (type.startsWith("charge.")) {
    baseEvent.data.object = {
      id: chargeId,
      object: "charge",
      amount: faker.number.int({ min: 100, max: 50000 }),
      amount_captured: faker.number.int({ min: 0, max: 50000 }),
      amount_refunded: faker.number.int({ min: 0, max: 10000 }),
      application: null,
      application_fee: null,
      application_fee_amount: null,
      balance_transaction: `txn_${faker.string.alphanumeric(24).toUpperCase()}`,
      billing_details: null,
      calculated_statement_descriptor: null,
      captured: faker.datatype.boolean(),
      created: Math.floor(Date.now() / 1000),
      currency: "usd",
      customer: customerId,
      description: faker.commerce.productName(),
      destination: null,
      dispute: null,
      disputed: false,
      failure_balance_transaction: null,
      failure_code: null,
      failure_message: null,
      fraud_details: null,
      invoice: null,
      livemode: false,
      metadata: {
        order_id: faker.string.numeric(5),
      },
      outcome: {
        network_status: "approved_by_network",
        reason: null,
        risk_level: "normal",
        risk_score: faker.number.int({ min: 1, max: 99 }),
        seller_message: "Payment complete.",
        type: "authorized",
      },
      paid: true,
      payment_intent: paymentIntentId,
      payment_method: `pm_${faker.string.alphanumeric(24).toUpperCase()}`,
      payment_method_details: {
        type: "card",
        card: {
          brand: faker.helpers.arrayElement(["visa", "mastercard", "amex"]),
          checks: {
            address_line1_check: null,
            address_postal_code_check: null,
            cvc_check: "pass",
          },
          country: "US",
          exp_month: faker.number.int({ min: 1, max: 12 }),
          exp_year: faker.number.int({ min: 2024, max: 2030 }),
          fingerprint: faker.string.alphanumeric(16).toUpperCase(),
          funding: faker.helpers.arrayElement(["credit", "debit"]),
          generated_from: null,
          last4: faker.string.numeric(4),
          networks: {
            available: ["visa"],
            preferred: null,
          },
          three_d_secure: null,
          wallet: null,
        },
      },
      receipt_email: faker.internet.email(),
      receipt_number: null,
      receipt_url: `https://receipts.stripe.com/${faker.string.alphanumeric(
        20
      )}`,
      refunded: false,
      refunds: {
        object: "list",
        data: [],
        has_more: false,
        total_count: 0,
        url: "/v1/charges/ch_test/refunds",
      },
      review: null,
      shipping: null,
      source_transfer: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: faker.helpers.arrayElement(["succeeded", "failed", "pending"]),
      transfer_data: null,
      transfer_group: null,
    };
  } else if (type.startsWith("customer.")) {
    baseEvent.data.object = {
      id: customerId,
      object: "customer",
      address: null,
      balance: 0,
      created: Math.floor(Date.now() / 1000),
      currency: "usd",
      default_source: null,
      delinquent: false,
      description: faker.person.fullName(),
      discount: null,
      email: faker.internet.email(),
      invoice_prefix: "INV",
      invoice_settings: {
        custom_fields: null,
        default_payment_method: null,
        footer: null,
      },
      livemode: false,
      metadata: {},
      name: faker.person.fullName(),
      next_invoice_sequence: 1,
      phone: faker.phone.number(),
      preferred_locales: [],
      shipping: null,
      tax_exempt: "none",
      test_clock: null,
    };
  } else if (type.startsWith("payment_intent.")) {
    baseEvent.data.object = {
      id: paymentIntentId,
      object: "payment_intent",
      amount: faker.number.int({ min: 100, max: 50000 }),
      amount_capturable: 0,
      amount_details: {
        tip: 0,
      },
      amount_received: faker.number.int({ min: 0, max: 50000 }),
      application: null,
      application_fee_amount: null,
      automatic_payment_methods: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: "automatic",
      charges: {
        object: "list",
        data: [],
        has_more: false,
        total_count: 0,
        url: `/v1/charges?payment_intent=${paymentIntentId}`,
      },
      client_secret: `${paymentIntentId}_secret_${faker.string.alphanumeric(
        34
      )}`,
      confirmation_method: "automatic",
      created: Math.floor(Date.now() / 1000),
      currency: "usd",
      customer: customerId,
      description: faker.commerce.productDescription(),
      flow_directions: null,
      livemode: false,
      metadata: {
        product_id: faker.string.numeric(5),
      },
      next_action: null,
      on_behalf_of: null,
      payment_method: `pm_${faker.string.alphanumeric(24).toUpperCase()}`,
      payment_method_options: {
        card: {
          installments: null,
          mandate_options: null,
          network: null,
          request_three_d_secure: "automatic",
        },
      },
      payment_method_types: ["card"],
      processing: null,
      receipt_email: faker.internet.email(),
      review: null,
      setup_future_usage: null,
      shipping: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: faker.helpers.arrayElement([
        "succeeded",
        "processing",
        "requires_action",
        "requires_confirmation",
        "requires_payment_method",
        "canceled",
      ]),
      transfer_data: null,
      transfer_group: null,
    };
  } else if (type.startsWith("invoice.")) {
    baseEvent.data.object = {
      id: invoiceId,
      object: "invoice",
      account_country: "US",
      account_name: "Test Company",
      account_tax_ids: null,
      amount_due: faker.number.int({ min: 100, max: 50000 }),
      amount_paid: faker.number.int({ min: 0, max: 50000 }),
      amount_remaining: faker.number.int({ min: 0, max: 10000 }),
      application: null,
      application_fee_amount: null,
      attempt_count: 0,
      attempted: false,
      auto_advance: true,
      automatic_tax: {
        enabled: false,
        status: null,
      },
      billing_reason: "subscription_cycle",
      charge: chargeId,
      collection_method: "charge_automatically",
      created: Math.floor(Date.now() / 1000),
      currency: "usd",
      custom_fields: null,
      customer: customerId,
      customer_address: null,
      customer_email: faker.internet.email(),
      customer_name: faker.person.fullName(),
      customer_phone: faker.phone.number(),
      customer_shipping: null,
      customer_tax_exempt: "none",
      customer_tax_ids: [],
      default_payment_method: null,
      default_source: null,
      default_tax_rates: [],
      description: faker.commerce.productName(),
      discount: null,
      discounts: [],
      due_date: Math.floor(Date.now() / 1000) + 86400 * 30,
      effective_at: Math.floor(Date.now() / 1000),
      email: faker.internet.email(),
      ending_balance: null,
      footer: null,
      footer_tax_rates: null,
      from_invoice: null,
      hosted_invoice_url: null,
      invoice_pdf: null,
      last_finalization_error: null,
      latest_revision: null,
      lines: {
        object: "list",
        data: [
          {
            id: `il_${faker.string.alphanumeric(24).toUpperCase()}`,
            object: "line_item",
            amount: faker.number.int({ min: 100, max: 50000 }),
            amount_excluding_tax: faker.number.int({ min: 100, max: 50000 }),
            billing_period: {
              end: Math.floor(Date.now() / 1000),
              start: Math.floor(Date.now() / 1000) - 86400 * 30,
            },
            currency: "usd",
            custom_fields: null,
            customer: customerId,
            description: faker.commerce.productName(),
            discount_amounts: [],
            discountable: true,
            discounts: [],
            invoice_item: `ii_${faker.string.alphanumeric(24).toUpperCase()}`,
            livemode: false,
            metadata: {},
            period: {
              end: Math.floor(Date.now() / 1000),
              start: Math.floor(Date.now() / 1000) - 86400 * 30,
            },
            plan: null,
            price: {
              id: `price_${faker.string.alphanumeric(24).toUpperCase()}`,
              object: "price",
              active: true,
              billing_scheme: "per_unit",
              created: Math.floor(Date.now() / 1000),
              currency: "usd",
              custom_unit_amount: null,
              livemode: false,
              lookup_key: null,
              metadata: {},
              nickname: null,
              product: `prod_${faker.string.alphanumeric(14).toUpperCase()}`,
              recurring: {
                aggregate_usage: null,
                interval: "month",
                interval_count: 1,
                meter: null,
                usage_type: "licensed",
              },
              tax_behavior: "unspecified",
              tiers_mode: null,
              transform_quantity: null,
              type: "recurring",
              unit_amount: faker.number.int({ min: 100, max: 50000 }),
              unit_amount_decimal: faker.number
                .int({ min: 100, max: 50000 })
                .toString(),
            },
            proration: false,
            proration_details: {
              credited_items: null,
            },
            quantity: 1,
            subscription: null,
            subscription_item: null,
            tax_amounts: [],
            type: "line_item",
            unit_amount_excluding_tax: faker.number.int({
              min: 100,
              max: 50000,
            }),
          },
        ],
        has_more: false,
        total_count: 1,
        url: `/v1/invoices/${invoiceId}/lines`,
      },
      livemode: false,
      metadata: {},
      next_payment_attempt: null,
      number: `${faker.string.numeric(6)}-0001`,
      on_behalf_of: null,
      paid: faker.datatype.boolean(),
      paid_out_of_band: false,
      payment_intent: paymentIntentId,
      payment_settings: {
        payment_method_options: null,
        payment_method_types: null,
        save_default_payment_method: "off",
      },
      period_end: Math.floor(Date.now() / 1000),
      period_start: Math.floor(Date.now() / 1000) - 86400 * 30,
      post_payment_credit_notes_amount: 0,
      pre_payment_credit_notes_amount: 0,
      quote: null,
      receipt_number: null,
      rendering_options: null,
      rendering: {
        amount_due: {
          currency: true,
        },
        pdf: null,
      },
      revision_number: 0,
      scheduled: false,
      statement_descriptor: null,
      status: faker.helpers.arrayElement([
        "draft",
        "open",
        "paid",
        "uncollectible",
        "void",
      ]),
      status_transitions: {
        finalized_at: Math.floor(Date.now() / 1000),
        marked_uncollectible_at: null,
        paid_at: null,
        voided_at: null,
      },
      subscription: null,
      subtotal: faker.number.int({ min: 100, max: 50000 }),
      subtotal_excluding_tax: faker.number.int({ min: 100, max: 50000 }),
      test_clock: null,
      total: faker.number.int({ min: 100, max: 50000 }),
      total_discount_amounts: [],
      total_excluding_tax: faker.number.int({ min: 100, max: 50000 }),
      total_tax_amounts: [],
      transfer_data: null,
      url: `https://invoice.stripe.com/i/${faker.string.alphanumeric(60)}`,
      user_supplied_frm_data: null,
    };
  }

  return baseEvent;
};

async function seedStripeWebhooks() {
  try {
    console.log("🌱 Seeding Stripe webhooks...");

    const webhookRecords = [];

    for (let i = 0; i < 20; i++) {
      const eventType = faker.helpers.arrayElement(STRIPE_EVENTS);
      const event = generateStripeEvent(eventType);

      webhookRecords.push({
        method: "POST",
        pathname: `/webhooks/stripe`,
        ip: faker.internet.ipv4(),
        statusCode: faker.helpers.arrayElement([200, 201, 400, 500]),
        contentType: "application/json",
        contentLength: JSON.stringify(event).length,
        queryParams: {},
        headers: getStripeHeaders(),
        body: JSON.stringify(event),
        createdAt: faker.date.recent({ days: 30 }),
      });
    }

    await db.insert(webhooks).values(webhookRecords);

    console.log(
      `✅ Successfully seeded ${webhookRecords.length} webhook records`
    );
  } catch (error) {
    console.error("❌ Error seeding webhooks:", error);
    process.exit(1);
  }
}

seedStripeWebhooks();
