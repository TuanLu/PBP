<?php
class Magebay_Productbuilderpro_DerectiveController extends Mage_Core_Controller_Front_Action
{
    public function pbpGroupAction()
    {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/derectives/pbp-group.phtml")->toHtml();
    }
}