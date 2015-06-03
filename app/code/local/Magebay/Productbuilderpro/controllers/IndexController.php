<?php
class Magebay_Productbuilderpro_IndexController extends Mage_Core_Controller_Front_Action
{
    public function indexAction()
    {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/index.phtml")->toHtml();
    }
    public function editOptionAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/edit_option.phtml")->toHtml();
    }
    public function addGroupAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/add_group.phtml")->toHtml();
    }
}