package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface VillageService {

	public void pageVillage(Paging paging, List<Filter> filters, Integer company);

	public VillageVO queryVillageById(VillageVO villageVO) throws FLException;

	public List<VillageVO> queryVillageForNameByPinyin(String pinyinName, Integer company);

	public int addVillage(VillageVO villageVO, Integer company) throws FLException;

	public int updateVillage(VillageVO villageVO, Integer company) throws FLException;

	public int updateVillageForStatus(VillageVO villageVO) throws FLException;

	public int updateVillageForPosition(VillageVO villageVO) throws FLException;

	public int updateVillageForUrl(VillageVO villageVO) throws FLException;

}
