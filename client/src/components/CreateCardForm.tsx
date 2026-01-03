import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ShoppingBag,
  Plane,
  Gamepad2,
  Lightbulb,
  Receipt,
  CreditCard,
  Shield,
  Bell,
  Clock,
  Lock,
  Sparkles,
  CalendarIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { CardCategory, CardType } from "@shared/schema";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Card name is required").max(50, "Name too long"),
  email: z.string().email("Please enter a valid email address"),
  type: z.enum(["virtual", "physical", "disposable"]),
  dailyLimit: z.string(),
  perTransactionLimit: z.string(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  autoFreezeAfterInactivity: z.boolean(),
  twoFactorAuth: z.boolean(),
  instantNotifications: z.boolean(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  activeFrom: z.date().nullable(),
  activeUntil: z.date().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: { value: CardCategory; label: string; icon: typeof ShoppingBag }[] = [
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "gaming", label: "Gaming", icon: Gamepad2 },
  { value: "utilities", label: "Utilities", icon: Lightbulb },
  { value: "subscriptions", label: "Subscriptions", icon: Receipt },
];

export function CreateCardForm({ open, onOpenChange }: CreateCardFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCard } = useAppStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      type: "virtual",
      dailyLimit: "1000",
      perTransactionLimit: "500",
      categories: ["shopping"],
      autoFreezeAfterInactivity: false,
      twoFactorAuth: true,
      instantNotifications: true,
      expiryDate: "",
      activeFrom: null,
      activeUntil: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      addCard({
        name: data.name,
        type: data.type as CardType,
        dailyLimit: parseFloat(data.dailyLimit) || 0,
        perTransactionLimit: parseFloat(data.perTransactionLimit) || 0,
        categories: data.categories as CardCategory[],
        autoFreezeAfterInactivity: data.autoFreezeAfterInactivity,
        twoFactorAuth: data.twoFactorAuth,
        instantNotifications: data.instantNotifications,
        expiryDate: data.expiryDate,
        activeFrom: data.activeFrom ? data.activeFrom.toISOString() : null,
        activeUntil: data.activeUntil ? data.activeUntil.toISOString() : null,
      });
      
      try {
        await fetch("/api/send-card-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, cardName: data.name }),
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
      
      form.reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            Create Virtual Card
          </DialogTitle>
          <DialogDescription>
            Configure your new virtual card with custom spending limits and security options
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Card Details
              </h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Shopping Card, Travel Fund"
                        {...field}
                        data-testid="input-card-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@gmail.com"
                        {...field}
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormDescription>
                      We will send a confirmation email when your card is created
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-3"
                      >
                        <div>
                          <RadioGroupItem
                            value="virtual"
                            id="virtual"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="virtual"
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                            data-testid="radio-type-virtual"
                          >
                            <CreditCard className="mb-2 h-6 w-6" />
                            <span className="text-sm font-medium">Virtual</span>
                          </Label>
                        </div>
                        <div className="relative">
                          <RadioGroupItem
                            value="physical"
                            id="physical"
                            className="peer sr-only"
                            disabled
                          />
                          <Label
                            htmlFor="physical"
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 opacity-50 cursor-not-allowed"
                          >
                            <CreditCard className="mb-2 h-6 w-6" />
                            <span className="text-sm font-medium">Physical</span>
                            <span className="text-xs text-muted-foreground mt-1">Coming Soon</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="disposable"
                            id="disposable"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="disposable"
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                            data-testid="radio-type-disposable"
                          >
                            <Clock className="mb-2 h-6 w-6" />
                            <span className="text-sm font-medium">Disposable</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Spending Limits
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dailyLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Limit</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            className="pl-7"
                            placeholder="1000"
                            {...field}
                            data-testid="input-daily-limit"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="perTransactionLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Per Transaction Limit</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            className="pl-7"
                            placeholder="500"
                            {...field}
                            data-testid="input-per-tx-limit"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Allowed Categories</h3>
              
              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CATEGORIES.map((category) => (
                        <FormField
                          key={category.value}
                          control={form.control}
                          name="categories"
                          render={({ field }) => {
                            const Icon = category.icon;
                            return (
                              <FormItem
                                key={category.value}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={field.value?.includes(category.value)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, category.value])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== category.value
                                              )
                                            );
                                      }}
                                      data-testid={`checkbox-category-${category.value}`}
                                    />
                                    <Label className="flex items-center gap-2 cursor-pointer">
                                      <Icon className="w-4 h-4 text-muted-foreground" />
                                      {category.label}
                                    </Label>
                                  </div>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Security Options
              </h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="autoFreezeAfterInactivity"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto Freeze After Inactivity</FormLabel>
                        <FormDescription>
                          Automatically freeze card after 30 days of no activity
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-auto-freeze"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twoFactorAuth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">2FA on Transactions</FormLabel>
                        <FormDescription>
                          Require two-factor authentication for all transactions
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-2fa"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instantNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          Instant Notifications
                        </FormLabel>
                        <FormDescription>
                          Get notified immediately for every transaction
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-notifications"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                Active Period
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="activeFrom"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Active From</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              data-testid="button-active-from"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When the card becomes active
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activeUntil"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Active Until</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              data-testid="button-active-until"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When the card expires
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Expiry (MM/YY)</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} data-testid="input-expiry-date" />
                  </FormControl>
                  <FormDescription>
                    The expiry date shown on the card
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-create"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} data-testid="button-create-card">
                {isSubmitting ? "Creating..." : "Create Card"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
