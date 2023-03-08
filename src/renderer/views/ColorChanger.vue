<template>
  <Container>
    <Header />
    <PageTitle :title="$t('colorChanger.title', { device: device.name })" />
    <Content>
      <Block :inline="true" :horizontalCenter="true" :fadeIn="true">
        <ColorPicker :initialColor="device.data.color.hex" v-model="color" />
      </Block>
      <Block :verticalCenter="true" height="64px">
        <Paragraph type="smaller" v-html="$t('colorChanger.whiteLevel')" />
        <InputRange :defaultValue="device.data.warmWhite" v-model="white" :max="255" />
      </Block>
      <Block>
        <Paragraph type="smaller" v-html="$t('colorChanger.presets')" />
        <Block :inline="true">
          <Button
            v-if="lastColor && (lastColor.hex !== color.hex)"
            :boxy="true"
            :color="lastColor.hex"
            :spacerRight="true"
            v-on:click="selectPreset({color: lastColor})"
          >
            <Icon icon="undo" />
          </Button>
          <Button
            v-for="(preset, index) in presets"
            v-bind:key="index"
            :boxy="true"
            :color="preset.color.hex"
            :spacerRight="true"
            v-on:click="presetAction(preset, index)"
          >
            <Icon v-if="deleting" icon="close" />
          </Button>
          <Button
            v-if="presets.length < $config.maxPresets && !deleting"
            :boxy="true"
            color="transparent"
            v-on:click="addPreset"
          >
            <Icon :classes="shakeClass" icon="plus" />
          </Button>
          <Button
            v-if="presets.length > 0"
            :boxy="true"
            color="transparent"
            v-on:click="toggleDelete"
          >
            <Icon icon="delete" />
          </Button>
        </Block>
      </Block>
    </Content>
  </Container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { DevicesModule } from 'renderer/store/modules/Devices';
import { PresetsModule } from 'renderer/store/modules/Presets';

import { Device } from 'shared/types/Device';
import { Color } from 'shared/types/Color';
import { Preset } from 'shared/types/Preset';

import Container from 'renderer/components/Container.vue';
import Header from 'renderer/components/Header.vue';
import PageTitle from 'renderer/components/PageTitle.vue';
import Button from 'renderer/components/Button.vue';
import Content from 'renderer/components/Content.vue';
import Block from 'renderer/components/Block.vue';
import Icon from 'renderer/components/Icon.vue';
import Paragraph from 'renderer/components/Paragraph.vue';
import ColorPicker from 'renderer/components/ColorPicker.vue';
import InputRange from 'renderer/components/InputRange.vue';
import { getBrightness } from "renderer/utils";

@Component({
  components: {
    Container,
    Header,
    PageTitle,
    Button,
    Content,
    Block,
    Icon,
    Paragraph,
    ColorPicker,
    InputRange,
  },
})
export default class ColorChanger extends Vue {
  lastColor: Color | null = null;
  deleting = false;
  shouldShake = false;
  device: Device | null = null

  get color() {
    if (!this.device) {
       return { r: 0, g: 0, b: 0, hex: '#000000' };
    }

    return this.device.data.color;
  }

  set color(color: Color) {
    if (this.device) {
      if (getBrightness(this.device.data.color) > 5) {
        this.lastColor = Object.assign({}, this.device.data.color);
      }

      this.changeColor(color, this.white);
    }
  }

  get white() {
    return this.device ? this.device.data.warmWhite : 0;
  }

  set white(whiteLevel: number) {
    this.changeColor(this.color, whiteLevel);
  }

  get presets() {
    return PresetsModule.list;
  }

  get shakeClass() {
    return (this.shouldShake) ? 'shake' : '';
  }

  created() {
    PresetsModule.getPresets();

    const { address } = this.$route.params;

    const deviceIndex = DevicesModule.list.findIndex(device => device.address == address)

    if (deviceIndex === -1) {
      this.$router.push({ name: 'devices' });

      return;
    }

    this.device = DevicesModule.list[deviceIndex];
  }

  async changeColor(color: Color, white: number) {
    if (this.device) {
      await DevicesModule.changeDeviceColor({
        address: this.device.address,
        color,
        white,
      });
    }
  }

  async addPreset() {
    if (this.device) {
      const color = Object.assign({}, this.color)

      this.shouldShake = !await PresetsModule.addPreset({
        color,
      })

      if (this.shouldShake) {
        setTimeout(() => {
          this.shouldShake = false
        }, 820)
      }
    }
  }

  async presetAction(preset: Preset, index: number) {
    if (this.deleting) {
      await this.removePreset(index);

      return;
    }

    await this.selectPreset(preset);
  }

  async selectPreset(preset: Preset) {
    await this.changeColor(preset.color, this.white);
   }

  async removePreset(index: number) {
    await PresetsModule.removePreset(index);

    if (this.presets.length === 0) {
      this.deleting = false;
    }
  }

  toggleDelete() {
    this.deleting = !this.deleting;
  }
}
</script>

<style lang="scss">
  .shake {
    animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>
