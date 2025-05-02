import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type props = {
  title: string;
  description: string;
  body: React.ReactNode;
};

export const TermsPrivacyDialog = ({ title, description, body }: props) => {
  return (
    <Dialog>
      <DialogTrigger className="underline underline-offset-4 hover:text-primary">
        {title}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            <p>{description}</p>
          </DialogDescription>
          <div className="pt-2">{body}</div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
