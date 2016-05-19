
package com.fanglin.data.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.vo.VillageVO;
import com.fanglin.utils.Paging;

public interface VillageService {
	
	public void pageVillage(Paging paging, List<FilterVO> filters);
	
	public List<VillageVO> queryVillage(List<FilterVO> filters);
	
	public VillageVO queryVillageById(VillageVO villageVO);
	
	public List<VillageVO> queryVillageForNameByPinyin(String pinyinName);
	
}
