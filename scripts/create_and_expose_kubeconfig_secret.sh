#!/bin/bash
set -ex
cp $KUBECONFIG /tmp/config.yaml
kubectl --kubeconfig=/tmp/config.yaml config set-cluster default --server=https://$MY_IP:6443
kubectl create secret generic ci-kubeconfig --from-file=/tmp/config.yaml
kubectl apply -f ./scripts/ci-kubeconfig-nginx.yaml
kubectl rollout status deployment ci-nginx --timeout=480s
kubectl create ingress ci-nginx --rule="ci.$MY_IP.nip.io/*=ci-nginx:80,tls"
