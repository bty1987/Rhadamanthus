/**
 * Title: DepartmentDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DepartmentDao extends Dao<DepartmentPO> {

	public List<DepartmentPO> pageDepartment(Paging paging, List<Filter> filters, Integer type, int company);

	public List<DepartmentPO> pageDepartmentByName(Paging paging, String name, Integer type, Integer company);

	public List<DepartmentPO> queryDepartment(Integer type, Integer fdid, Integer company);

	public List<DepartmentPO> queryDepartment(Integer did);

	public DepartmentPO queryDepartmentByNo(String no);

	/**
	 * 根据名称和公司ID查询部门
	 *
	 * @param name 部门名称
	 * @param companyId 公司ID
	 * @return 部门对象
	 */
	public DepartmentPO queryDepartmentByNameAndCompany(String name, Integer companyId);

	/**
	 * 查询指定公司的最大部门编号
	 *
	 * @param companyId 公司ID
	 * @return 最大部门编号（如：DEPT0001）
	 */
	public String queryMaxDepartmentNoByCompany(Integer companyId);

}
