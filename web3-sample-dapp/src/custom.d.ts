import { Web3Provider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: Web3Provider;
  }
}