import IpcChannelInterface from 'main/ipc/IpcChannelInterface';

import { IpcMainEvent } from 'electron';
import IpcRequest from 'shared/types/IpcRequest';

import { Color } from 'shared/types/Color';

import { getControllerByDevice } from 'main/utils';

export default class ChangeDeviceColorChannel implements IpcChannelInterface {
  public getName() {
    return 'change-device-color';
  }

  public async handle(event: IpcMainEvent, request: IpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

    const address = request.params.address as string;
    const color = request.params.color as Color;
    const white = request.params.white as number || 0;

    let state = false;

    const controller = getControllerByDevice(address);

    if (controller) {
      state = await controller.changeDeviceColor(address, color, white);
    }

    event.sender.send(request.responseChannel, state);
  }
}
