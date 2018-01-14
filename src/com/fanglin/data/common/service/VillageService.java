
package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.VillageVO;

import com.fanglin.utils.Paging;

public interface VillageService {
	
	public void pageVillage(Paging paging, List<Filter> filters);
	
	public VillageVO queryVillageById(VillageVO villageVO) throws FLException;
	
	public List<VillageVO> queryVillageForNameByPinyin(String pinyinName);
	
	public int addVillage(VillageVO villageVO) throws FLException;
	
	public int updateVillage(VillageVO villageVO) throws FLException;
	
	public int updateVillageForStatus(VillageVO villageVO) throws FLException;
	
	public int updateVillageForPosition(VillageVO villageVO) throws FLException;
	
}
