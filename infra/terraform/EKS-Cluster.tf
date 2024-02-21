provider "aws" {
  region     = "us-east-1"
}


resource "aws_eks_cluster" "tour-app" {
  name     = "tour-app"
  role_arn = var.eks-cluster-role-arn
  vpc_config {
    
    subnet_ids = [var.subnet-controlplane1, var.subnet-controlplane2]
  }

}

resource "aws_eks_node_group" "tour-app-nodegrp" {
  cluster_name    = aws_eks_cluster.tour-app.name
  node_group_name = var.eks-cluster-node-grp-name
  node_role_arn   = var.eks-cluster-nodegrp-role-arn
  subnet_ids      = [var.subnet-tourapp-nodegrp]

  scaling_config {
    desired_size = 2
    max_size     = 2
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }
}


