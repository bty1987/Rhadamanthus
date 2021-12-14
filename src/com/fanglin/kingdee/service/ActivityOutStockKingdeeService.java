package com.fanglin.kingdee.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.vo.ManifestItemVO;

public interface ActivityOutStockKingdeeService {
	
	public void out(ManifestPO manifestPO, List<ManifestItemVO> manifestItemVOs) throws FLException; 
	
}
