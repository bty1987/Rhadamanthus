package com.fanglin.quotation.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationConfigPO;

/**
 * 预算配置表 DAO 接口
 */
public interface QuotationConfigDao extends Dao<QuotationConfigPO> {

	/**
	 * 根据公司和部门查询配置
	 * @param company 公司ID
	 * @param department 部门ID（可选，NULL表示公司级别配置）
	 * @return 预算配置
	 */
	QuotationConfigPO findByCompanyAndDepartment(Integer company, Integer department);

	/**
	 * 查询公司的配置列表
	 * @param company 公司ID
	 * @return 配置列表
	 */
	java.util.List<QuotationConfigPO> findByCompany(Integer company);
}
