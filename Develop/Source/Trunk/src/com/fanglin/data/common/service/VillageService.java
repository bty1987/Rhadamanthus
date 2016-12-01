
package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.utils.Paging;

public interface VillageService {
	
	public void pageVillage(Paging paging, List<Filter> filters);
	
	public List<VillageVO> queryVillage(List<Filter> filters);
	
	public VillageVO queryVillageById(VillageVO villageVO);
	
	public List<VillageVO> queryVillageForNameByPinyin(String pinyinName);
	
}
