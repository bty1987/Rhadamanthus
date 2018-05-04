package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.inventory.vo.PurchaseManifestVO;

public interface PurchaseManifestService {

	public List<PurchaseManifestVO> queryPurchaseManifestByPids(List<Long> pids);
	
}
