<?php
class Magebay_Productbuilderpro_Block_Checkout_Onepage_Review_Info extends Mage_Core_Block_Abstract
{
    protected function _toHtml()
    {
        $item = $this->getParentBlock()->getItem();
		$buyRequest = $item->getData();
        $additionalOptions = $item->getProduct()->getCustomOption('additional_options')->getData('value');
        if($additionalOptions) {
            $customizeInfo = Mage::helper("productbuilderpro")->getCustomizeInfo($additionalOptions);
            if($customizeInfo) {
                $block = $this->getLayout()->createBlock('core/template')
                ->setTemplate('productbuilderpro/checkout/onepage/review/info.phtml')
                ->setData('customize_info', $customizeInfo);
                return $block->toHtml();    
            }
        }
    }
}