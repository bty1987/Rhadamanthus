package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Paging;

public interface CompanyDao extends Dao<CompanyPO> {

	public List<CompanyPO> pageCompany(Paging paging, List<Filter> filters);

	public List<CompanyPO> queryCompany(Short atttype, String code);

	public CompanyPO queryCompanyByName(String name);

	public CompanyPO queryCompanyByNo(int no);
}
