import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-secondary flex">
      <SidebarNav />
      <div className="flex-1 md:ml-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Terms & Conditions
              </h1>
            </div>
            <p className="text-muted-foreground">
              FR2P Financial Roadway 2 Prosperity Affiliate Program
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Affiliate Program Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8 text-sm">
                  {/* Section 5 */}
                  <section>
                    <h2 className="text-xl font-bold text-primary mb-4">
                      SECTION 5: INDEPENDENT BUSINESS OWNER STATUS & TAX REPORTING
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          5.1. Independent Business Owner (IBO) Status
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          By becoming a Member of the FR2P Financial Roadway 2 Prosperity Affiliate Program, you expressly agree and acknowledge that you are operating as an <strong>Independent Business Owner (IBO)</strong> and not as an employee, joint venturer, partner, or agent of FR2P. As an IBO, you maintain an independent online business and back office, and your compensation is solely commission-based, derived from the successful promotion and sale of FR2P's products or services. You are solely responsible for all business decisions, expenses, and actions related to your independent business.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          5.2. Tax and Legal Obligations
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          As an IBO, you are solely responsible for all federal, state, and local taxes, licenses, and permits required to operate your independent business. FR2P will not withhold any taxes from your commission payments.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          5.3. Tax Reporting (Form 1099-NEC)
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          For U.S. tax purposes, any Member who earns <strong>$600 or more</strong> in non-employee compensation (commissions) during a calendar year will be issued <strong>IRS Form 1099-NEC (Nonemployee Compensation)</strong> by FR2P. This form will be furnished to you and the Internal Revenue Service (IRS) by the annual deadline, reporting the gross commissions paid to you for the year.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 6 */}
                  <section className="border-t pt-6">
                    <h2 className="text-xl font-bold text-primary mb-4">
                      SECTION 6: COMMISSION, PAYOUTS, & CAPITAL RESERVE
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          6.1. Commission Holding Period (90-Day Delay)
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Commissions earned by an IBO on qualified sales will be subject to a <strong>ninety (90) calendar day holding period</strong> from the date the commission is generated. This means that an IBO will not receive their first commission payout until at least ninety (90) days after their first commissionable sale. This holding period is implemented to allow the Company to stabilize its financial reserves, ensure the verification of sales, and manage the necessary operational float required to sustain the commission payment structure for all Members.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          6.2. Mandatory Capital Reserve Deduction (Membership Fee Rebate)
                        </h3>
                        <div className="text-muted-foreground leading-relaxed space-y-2">
                          <p>
                            To provide a long-term benefit and offset the annual membership fee, a portion of each qualified commission payment will be automatically reserved by the Company on your behalf.
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>
                              From every commission check and/or direct deposit of <strong>$50 or more</strong>, a fixed amount of <strong>$25</strong> will be automatically deducted.
                            </li>
                            <li>
                              This deducted amount will be immediately placed into a dedicated <strong>Capital Reserve Account</strong> maintained by the Company on your behalf.
                            </li>
                            <li>
                              This is a <strong>mandatory, non-negotiable</strong> term of the Affiliate Program.
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          6.3. Capital Reserve Retrieval (1-Year Anniversary)
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          The funds accumulated in your Capital Reserve Account will be held for <strong>one (1) full year</strong>. You will only be eligible to retrieve the total accumulated Capital Reserve balance on your <strong>one (1) year IBO anniversary date</strong> (12 months after the date of your initial enrollment). This reserve is designed to effectively refund your membership fee for the year, provided you remain an active IBO in good standing for the full 12-month period.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          6.4. Charity Donation Option
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Should a Member elect to donate a portion of their earned commission to a designated charity, such donation must be made <strong>after the commission has been processed and disbursed to the IBO</strong>, and <strong>after the mandatory Capital Reserve deduction has been applied</strong>. The IBO maintains the ultimate choice and tax responsibility for any charitable donation made from their net commission earnings.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Important Notice */}
                  <section className="border-t pt-6">
                    <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">
                        Important Notice
                      </h3>
                      <p className="text-amber-800 dark:text-amber-200 text-sm">
                        By enrolling in the FR2P Affiliate Program and remaining active for at least 6 months, you will be considered an Independent Business Owner (IBO) and will receive a <strong>Form 1099-NEC</strong> at the end of the year for tax purposes. Please consult with a tax professional regarding your specific tax obligations.
                      </p>
                    </div>
                  </section>

                  {/* Acceptance */}
                  <section className="border-t pt-6">
                    <div className="bg-primary/5 rounded-lg p-6">
                      <p className="text-sm text-muted-foreground italic text-center">
                        By using the FR2P platform and participating in the affiliate program, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                      </p>
                      <p className="text-xs text-center text-muted-foreground mt-4">
                        Last Updated: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
