import { mount } from 'svelte';
import './styles/reset.css';
import '@picocss/pico';
import './styles/boot.scss';
import App from './App.svelte';

const app = mount(App, {
  target: document.body.appendChild(document.createElement('main'))!,
});

export default app;
