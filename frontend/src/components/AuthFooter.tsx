import { TermsPrivacyDialog } from "./TermsPrivacyDialog";

const item = {
  terms: {
    title: "Terms of Service",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus?",
    body: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae debitis consectetur voluptatem atque labore. Adipisci tempora autem debitis quae exercitationem ullam magnam minus officia, vero consequatur earum animi cupiditate.
    Soluta cupiditate quidem ab cumque rem. Beatae nisi deserunt in aperiam unde ut maxime explicabo, incidunt architecto amet, quam iure consequatur, vero dolor quis. Incidunt laudantium facere facilis expedita.
    Recusandae magnam omnis repellendus dignissimos optio cumque odio, eos ad suscipit deserunt, molestias consectetur iste similique accusantium, fuga adipisci. Doloribus nesciunt accusantium in eaque, at inventore ea nobis aspernatur?
    Dolore facere nobis praesentium a tempora distinctio. Eveniet fugiat, voluptatibus, ut dolores officia facilis minima odio cumque autem eligendi animi, nesciunt doloribus non! Illo quis explicabo sit nihil atque.
    Ipsam natus sint eveniet autem vitae, laborum possimus vero perspiciatis impedit, libero in optio sapiente odio quod nam ullam tenetur laboriosam, rem provident quia dolore. Eligendi et id fuga!`,
  },
  privacy: {
    title: "Privacy Polivcy",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam!",
    body: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium autem molestiae odio et delectus excepturi debitis officia eligendi eius nobis, voluptatibus corporis impedit nam quos suscipit voluptatem voluptatum beatae!
    Odio ut numquam illo. Mollitia voluptas nisi repudiandae vel unde voluptatum obcaecati possimus tempora incidunt, dolorem, modi esse? Illo veniam nobis officiis odio consectetur unde porro ab soluta dolorem!
    Voluptatibus a voluptatem hic eum quisquam enim provident vel voluptatum assumenda nulla eaque, itaque labore deserunt amet. Aut facere delectus voluptatum dolorum possimus, nostrum asperiores distinctio optio non inventore.
    Commodi odit neque repellat inventore beatae eos doloremque consectetur tempora pariatur fuga sequi quae sint aliquid, dolorem delectus dicta soluta alias assumenda cum eius asperiores. Molestias voluptatibus ea maxime!
    Unde nulla distinctio, dolorem sequi, nisi, tempore eaque dolore cumque atque vel voluptas ut iusto temporibus quod mollitia eligendi vero iure. Optio recusandae ab neque dolorum vel rerum nobis?`,
  },
};

export const AuthFooter = () => {
  return (
    <div className="text-balance text-center text-xs text-muted-foreground">
      By clicking continue, you agree to our{" "}
      <TermsPrivacyDialog
        title={item.terms.title}
        description={item.terms.description}
        body={item.terms.body}
      />{" "}
      and{" "}
      <TermsPrivacyDialog
        title={item.privacy.title}
        description={item.privacy.description}
        body={item.privacy.body}
      />
      .
    </div>
  );
};
