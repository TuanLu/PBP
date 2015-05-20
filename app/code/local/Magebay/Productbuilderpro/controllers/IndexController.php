<?php
class Magebay_Productbuilderpro_IndexController extends Mage_Core_Controller_Front_Action
{
    public function indexAction()
    {
        $this->loadLayout();
        $this->renderLayout();
    }
	public function testAction() {
		echo "Product Builder Pro";
		
	}
    public function addProductAction() {
        echo "Add Product Page";
    }
}