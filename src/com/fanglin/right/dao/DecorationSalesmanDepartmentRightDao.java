/**
 * @File Name		: DecorationSalesmanDepartmentRightDao.java
 * @Package   	: com.fanglin.right.dao
 * @Version		: 1.0
 * @Date			: 2016-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.DecorationSalesmanDepartmentRightPO;

public interface DecorationSalesmanDepartmentRightDao extends Dao<DecorationSalesmanDepartmentRightPO> {

	public List<DecorationSalesmanDepartmentRightPO> queryDecorationSalesmanDepartmentRight(int uId, int company);

	public int syncDecorationSalesmanDepartmentRight(int uid, List<Integer> companys, int company);

	public int deleteDecorationSalesmanDepartmentRight(int uId, int company);

	public int deleteDecorationSalesmanDepartmentRight(int uId, List<Integer> companys);

}
