<?php
class Magebay_Productbuilderpro_IndexController extends Mage_Core_Controller_Front_Action
{
    public function testAction() {
        echo "Get Layers<pre>";
        $layerModel = Mage::getModel("productbuilderpro/layer");
        $layers = $layerModel->getLayerByGroupId(1);
        Zend_Debug::dump($layers);
    }
    public function indexAction()
    {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/index.phtml")->toHtml();
    }
    public function getDesignPageAction()
    {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/design.phtml")->toHtml();
    }
    public function editOptionAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/edit_option.phtml")->toHtml();
    }
    public function addGroupAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/add_group.phtml")->toHtml();
    }
    public function addLayerAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/add_layer.phtml")->toHtml();
    }
    public function designItAction()
    {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/design_it.phtml")->toHtml();
    }
}