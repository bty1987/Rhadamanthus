package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.UpgradeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface UpgradeService {

	public void pageUpgrade(Paging paging, List<Filter> filters);

	public List<UpgradeVO> queryUpgrade(List<Filter> filters, UpgradeVO upgradeVO);

	public UpgradeVO matchUpgrade(UpgradeVO upgradeVO);

	public String maxUpgrade();

	public int addUpgrade(UpgradeVO upgradeVO) throws FLException;

	public int deleteUpgrade(UpgradeVO upgradeVO) throws FLException;

}
