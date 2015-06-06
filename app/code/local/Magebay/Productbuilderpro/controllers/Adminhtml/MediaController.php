<?php
class Magebay_Productbuilderpro_Adminhtml_MediaController extends Mage_Adminhtml_Controller_Action
{
    protected function _initAction()
    {
        $this->loadLayout()
            ->_setActiveMenu('productbuilderpro/productbuilderpro')
            ->_addBreadcrumb(Mage::helper('adminhtml')->__('Product Builder Manager'), Mage::helper('adminhtml')->__('Product Builder Manager - Media Manager'));
        return $this;
    }
    public function indexAction() {
        $this->_initAction();
        $this->loadLayout();
        $this->renderLayout();
    }
}