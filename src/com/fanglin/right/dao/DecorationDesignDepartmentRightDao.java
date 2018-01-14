/**
 * @File Name		: DecorationDesignDepartmentRightDao.java
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
import com.fanglin.right.po.DecorationDesignDepartmentRightPO;

public interface DecorationDesignDepartmentRightDao extends Dao<DecorationDesignDepartmentRightPO> {
	
	public List<DecorationDesignDepartmentRightPO> queryDecorationDesignDepartmentRightByUId(int uId, int company);
	
	public int deleteDecorationDesignDepartmentRightByUId(int uId, int company);

}
