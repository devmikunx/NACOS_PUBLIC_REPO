import {
  CreditCard,
  FileText,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Search,
  Home,
  Users,
  Laptop,
  Eye,
  CheckCircle,
  Shield,
} from "lucide-react";

export interface Guide {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: keyof typeof colorMap;
  duration: string;
  level: string;
  sections?: Section[];
  tips?: string[];
  proTips?: string[];
  commonIssues?: CommonIssue[];
  categories?: PracticeCategory[];
  contact?: string;
  warning?: string;
}

export interface Section {
  title: string;
  icon: React.ElementType;
  items: string[];
}

export interface CommonIssue {
  problem: string;
  solution: string;
  immediateSteps: string[];
}

export interface PracticeCategory {
  title: string;
  icon: React.ElementType;
  practices: string[];
}

export interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: keyof typeof colorMap;
}

export interface SupportContact {
  name: string;
  phone: string;
  hours: string;
}

export const colorMap = {
  emerald: "bg-emerald-100 text-emerald-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  yellow: "bg-yellow-100 text-yellow-600",
  gray: "bg-slate-100 text-slate-600",
  purple: "bg-purple-100 text-purple-600",
} as const;

export const guides: Guide[] = [
  {
    id: "payment-guide",
    title: "Payment Guide",
    description: "Complete step-by-step guide to making payments successfully",
    icon: CreditCard,
    color: "emerald",
    duration: "8 min read",
    level: "Beginner",
    sections: [
      {
        title: "Before You Start - What You Need",
        icon: Laptop,
        items: [
          "Active and stable internet connection",
          "Your matric number and registered email/phone",
          "Debit/credit card, bank transfer details, or mobile payment app",
          "Browser with pop-ups enabled (for payment gateway)",
          "Optional: Printer if you want paper copy of receipt",
        ],
      },
      {
        title: "Payment Process Overview",
        icon: Eye,
        items: [
          "Go to portal homepage → Click 'Pay Dues' button",
          "Choose Payment Type: Departmental or College",
          "Fill required information and verify amount",
          "Review and confirm all details",
          "Proceed to payment gateway",
          "Complete payment using your preferred method",
          "Receive confirmation and download receipt",
        ],
      },
      {
        title: "Step-by-Step Payment Instructions",
        icon: ArrowRight,
        items: [
          "From homepage or top navigation, click the 'Pay Dues' button",
          "Select your payment type: Departmental Dues or College Dues",
          "Fill your details (name, matric number, department, level, programme)",
          "Carefully verify all filled information",
          "Confirm your email and phone number are correct",
          "Double-check Payment Type and Amount to prevent wrong payments",
          "Click 'Continue' or 'Proceed to Payment'",
          "Review the summary screen showing: Student name, Matric number, Payment type, Amount",
          "The portal will open payment gateway (popup or inline page)",
          "Choose payment method: Card, Bank Transfer, or Mobile Payment",
          "Enter payment details (card number, expiry, CVV, etc.)",
          "If required, enter OTP sent to your phone/email for 3D Secure",
          "Click 'Pay Now' or 'Authorize Payment'",
          "Wait for payment processing - don't close the window",
        ],
      },
      {
        title: "After Successful Payment",
        icon: CheckCircle,
        items: [
          "You'll see confirmation page with: Payment Status: SUCCESS, Reference ID, Amount paid, Date/Time",
          "Click 'Generate Receipt' or 'Download Receipt' button",
          "Save the receipt immediately to your device",
          "You'll receive email confirmation with receipt link",
          "Keep your payment reference number safe for future queries",
        ],
      },
    ],
    tips: [
      "Pay during off-peak hours (early morning or late evening) for faster processing",
      "Use a browser you're familiar with for better experience",
      "Keep multiple payment methods ready as backup",
      "Double-check all amounts before confirming payment",
      "Save payment confirmation email for your records",
    ],
  },
  {
    id: "receipt-retrieval",
    title: "Receipt Retrieval",
    description: "How to find and download your payment receipts",
    icon: FileText,
    color: "green",
    duration: "5 min read",
    level: "Beginner",
    sections: [
      {
        title: "Retrieving Your Payment Receipt",
        icon: Search,
        items: [
          "Visit the association's website and navigate to the 'Search Receipt' section",
          "Click on 'Verify Payment and Receipt'",
          "Enter the reference number from your Paystack receipt (sent to your email)",
          "Follow the on-screen instructions carefully",
          "Submit your details",
          "Your receipt will be displayed immediately",
          "Download or print the receipt for your records",
        ],
      },
      {
        title: "Important Notes",
        icon: Shield,
        items: [
          "Use the EXACT reference number from your email receipt",
          "Reference numbers are case-sensitive",
          "Keep your payment confirmation emails safe",
          "Receipts are available immediately after successful payment",
          "You can retrieve receipts from previous payments",
        ],
      },
    ],
    tips: [
      "Save all payment confirmation emails in a dedicated folder",
      "Take screenshot of successful payment page as backup",
      "Download receipt immediately after payment confirmation",
      "Keep both digital and printed copies if possible",
    ],
    contact:
      "If you are still finding it difficult to get your receipt, contact the Financial Secretary immediately.",
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Common issues and how to fix them quickly",
    icon: AlertTriangle,
    color: "orange",
    duration: "10 min read",
    level: "All Levels",
    commonIssues: [
      {
        problem: "Payment deducted but receipt not generated",
        solution:
          "Wait 15-30 minutes for system processing. If issue persists, contact Financial Director with payment proof (screenshot/email).",
        immediateSteps: [
          "Refresh the page",
          "Check payment history",
          "Wait 30 minutes",
          "Check your email",
        ],
      },
      {
        problem: "Website not loading properly",
        solution:
          "Clear browser cache and cookies, try different browser or incognito mode. Ensure JavaScript is enabled.",
        immediateSteps: [
          "Clear browser cache",
          "Try different browser",
          "Check internet connection",
          "Disable ad-blockers",
        ],
      },
      {
        problem: "Payment gateway not responding",
        solution:
          "Check internet stability, try again after 10 minutes, or use a different payment method. Ensure pop-ups are allowed.",
        immediateSteps: [
          "Check internet speed",
          "Wait 10 minutes",
          "Try different payment method",
          "Allow pop-ups",
        ],
      },
      {
        problem: "Receipt shows incorrect information",
        solution:
          "Contact Software Director immediately with correct details and screenshot of error. Do not delete the receipt.",
        immediateSteps: [
          "Take screenshot",
          "Contact support immediately",
          "Keep incorrect receipt",
          "Provide correct details",
        ],
      },
      {
        problem: "Can't find receipt reference number",
        solution:
          "Check your email (including spam folder) for payment confirmation. Contact support with payment date and amount.",
        immediateSteps: [
          "Check email spam folder",
          "Search for 'payment confirmation'",
          "Contact support with payment details",
        ],
      },
      {
        problem: "Payment failed but amount deducted",
        solution:
          "Wait 2-3 hours for automatic reversal. If not reversed, contact your bank with transaction details.",
        immediateSteps: [
          "Wait 3 hours",
          "Check bank statement",
          "Contact your bank",
          "Keep transaction ID",
        ],
      },
    ],
    proTips: [
      "Always take screenshot of payment confirmation page",
      "Keep browser updated to latest version",
      "Use stable internet connection during payment",
      "Contact support during working hours for faster response",
    ],
  },
  {
    id: "best-practices",
    title: "Best Practices",
    description: "Tips for smooth and secure payment experience",
    icon: Lightbulb,
    color: "yellow",
    duration: "6 min read",
    level: "All Levels",
    categories: [
      {
        title: "Payment Success Tips",
        icon: CheckCircle,
        practices: [
          "Keep screenshots of payment confirmation and receipts",
          "Double-check all entered information before submitting",
          "Verify payment amount matches your actual dues",
        ],
      },
      {
        title: "Technical Preparation",
        icon: Laptop,
        practices: [
          "Use updated browsers (Chrome, Firefox, Safari recommended)",
          "Clear browser cache regularly for better performance",
          "Disable ad-blockers during payment process",
          "Test internet connection speed before starting payment",
        ],
      },
      {
        title: "Documentation & Records",
        icon: FileText,
        practices: [
          "Maintain a dedicated folder for all payment receipts",
          "Record payment dates and reference numbers in secure place",
          "Backup digital receipts to cloud storage or email",
          "Keep bank transaction records for cross-verification",
          "Save all payment confirmation emails",
        ],
      },
    ],
    proTips: [
      "Contact support 24 hours before deadlines for any issues",
      "Use the 'Search Receipt' feature to quickly find past payments",
      "Keep Financial Secretary contact information handy",
    ],
  },
];

export const quickActions: QuickAction[] = [
  {
    title: "Pay Dues",
    description: "Make a payment now",
    icon: CreditCard,
    href: "/pay",
    color: "emerald",
  },
  {
    title: "Search Receipt",
    description: "Find your receipts",
    icon: Search,
    href: "/search",
    color: "green",
  },
  {
    title: "Help Center",
    description: "Get support",
    icon: Users,
    href: "/help",
    color: "purple",
  },
  {
    title: "Back to Home",
    description: "Return to dashboard",
    icon: Home,
    href: "/",
    color: "gray",
  },
];

export const supportData = {
  financial: {
    name: "Financial Director",
    phone: "+234 907 466 0245",
    hours: "Mon-Fri: 9AM-5PM",
  },
  software: {
    name: "Software Director",
    phone: "+234 916 128 5212",
    hours: "24/7 Emergency Support",
  },
};
