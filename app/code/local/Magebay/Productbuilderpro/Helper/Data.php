<?php
require_once(Mage::getBaseDir("lib") . DS . "WideImage" . DS . "WideImage.php");
class Magebay_Productbuilderpro_Helper_Data extends Mage_Core_Helper_Abstract {
    public function getBaseUrl() {
		$url = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_LINK);
		//Check if website using store code in url
		$isUseStoreCodeInUrl = $this->isUseStoreCodeInUrl();
		if($isUseStoreCodeInUrl) {
			$url = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_WEB) . "index.php/";
			try {
				$defaultStore = $this->getDefaultStore();
				$code = $defaultStore->getCode();
				if($code && $code != "admin") {
					$url .= $code . "/";
				} else {
					$url .= "default/";
				}
			} catch(Exception $error) {
				
			}
		}
		$isSecure = Mage::app()->getStore()->isCurrentlySecure();
		if ($isSecure) {
			//If current page in secure mode, but menu url not in secure, => change menu to secure
			//secure mode your current URL is HTTPS
			if (!strpos($url, 'https://')) {
				$validUrl = str_replace('http://', 'https://', $url);
				$url = $validUrl;
			}
		} else {
			//page is in HTTP mode
			if (!strpos($url, 'http://')) {
				$validUrl = str_replace('https://', 'http://', $url);
				$url = $validUrl;
			}
		}
		return $url;
	}
	public function getDefaultStore() {
		$websites = Mage::app()->getWebsites();
		return $websites[1]->getDefaultStore();
	}
	public function isUseStoreCodeInUrl() {
		$isUseStoreCodeInUrl = Mage::getStoreConfig("web/url/use_store");
		if($isUseStoreCodeInUrl) {
			return true;
		}
		return false;
	}
    public function createThumbnail($layerImages) {
        $thumbnailDir = Mage::getBaseDir("media") . DS . "pbp" . DS . "thumbnails" . DS;
        $imageBaseDir = Mage::getBaseDir("media") . DS . "pbp" . DS . "images" . DS;
        $imageBaseUrl = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA) . "pbp/thumbnails/";
        if (!file_exists($thumbnailDir)) {
            mkdir($thumbnailDir, 0777);
        }
        if(is_array($layerImages) && !empty($layerImages)) {
            $img = WideImage::load($imageBaseDir . $layerImages[0]['main_image']);
            for ($i = 1; $i < count($layerImages); $i++) {
                $imgObject = WideImage::load($imageBaseDir . $layerImages[$i]['main_image']);
                $new = $img->merge($imgObject, 0, 0, 100);
                $img = $new;
            }
            $filename = "design-" . time() . ".png";
            $filePath = $thumbnailDir . $filename;
            $img->resize(500, 300)->saveToFile($filePath);
            if(file_exists($filePath)) {
                return $imageBaseUrl . $filename;
            }
        }
        return false;
    }
}
