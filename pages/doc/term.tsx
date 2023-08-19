import ReactMarkdown from "react-markdown";

const Term = () => {
  return (
    <div className={'px-2 py-2 dark:text-white'}>
      <ReactMarkdown className={'markdown prose w-full break-words dark:prose-invert light'}>
        Terms of Service

        Welcome to ChatGPT! These Terms of Service (&quot;Terms&quot;) govern your use of the ChatGPT service (&quot;Service&quot;) provided
        by ABANDON INC. (&quot;ABANDON,&quot; &quot;we,&quot; or &quot;us&quot;). By accessing or using the Service, you agree to be bound by these
        Terms. If you do not agree to these Terms, please do not use the Service.

        1. Description of Service
        ChatGPT is an AI-powered language model that provides conversational responses based on the input it receives.
        The Service allows users to interact with ChatGPT through a text-based interface.

        2. Use of the Service
        2.1 Eligibility
        You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you
        are at least 18 years old.

        2.2 User Responsibilities
        You are responsible for your use of the Service and for any content you generate or transmit through the
        Service. You agree not to use the Service for any illegal, harmful, or unauthorized purposes. You also agree not
        to engage in any activity that may interfere with or disrupt the Service or its servers.

        2.3 Prohibited Uses
        You agree not to use the Service to:
        - Violate any applicable laws or regulations
        - Infringe upon the rights of others
        - Transmit any viruses, malware, or other harmful code
        - Engage in any fraudulent or deceptive activities
        - Collect or store personal information of others without their consent
        - Impersonate any person or entity

        3. Intellectual Property
        ABANDON retains all rights, title, and interest in and to the Service, including all intellectual property
        rights. You acknowledge that the Service and its underlying technology may be protected by copyright, trademark,
        patent, trade secret, and other laws.

        4. Privacy
        Our Privacy Policy explains how we collect, use, and disclose information from users of the Service. By using
        the Service, you consent to our collection, use, and disclosure practices as described in the Privacy Policy.

        5. Limitation of Liability
        To the maximum extent permitted by law, ABANDON shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly,
        arising out of your use of the Service.

        6. Termination
        ABANDON may terminate or suspend your access to the Service at any time, without prior notice or liability, for
        any reason whatsoever, including if you breach these Terms.

        7. Modifications to the Terms
        ABANDON reserves the right to modify or replace these Terms at any time. Any changes will be effective
        immediately upon posting the revised Terms on the ABANDON website. Your continued use of the Service after any
        such changes constitutes your acceptance of the new Terms.

        8. Governing Law
        These Terms shall be governed by and construed in accordance with the laws of the State of California, United
        States, without regard to its conflict of laws principles.

        9. Entire Agreement
        These Terms constitute the entire agreement between you and ABANDON regarding the Service and supersede all prior
        agreements and understandings, whether written or oral.

        If you have any questions or concerns about these Terms, please contact us at support@abandon.ai.
      </ReactMarkdown>
    </div>
  )
}

export default Term