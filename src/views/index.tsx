import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import AppStore from '../stores/useApp';

function Main() {
  const { setMediaDialog, openMedia } = AppStore;

  useEffect(() => {
    console.log('openMedia', openMedia);
  }, [openMedia]);

  return (
    <>
      <Button onClick={() => setMediaDialog(true)}>
        Open Media MefiPlatform
      </Button>
      <Dialog open={openMedia} onOpenChange={(open) => setMediaDialog(open)}>
        <DialogContent className="!tw-max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                defaultValue="@peduarte"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default observer(Main);
