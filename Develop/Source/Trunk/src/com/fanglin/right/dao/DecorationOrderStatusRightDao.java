/**
 * @File Name		: DecorationOrderStatusRightDao.java
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
import com.fanglin.right.po.DecorationOrderStatusRightPO;

public interface DecorationOrderStatusRightDao extends Dao<DecorationOrderStatusRightPO> {
	
	public List<DecorationOrderStatusRightPO> queryDecorationOrderStatusRightByUId(int uId);
	
	public int deleteDecorationOrderStatusRightByUId(int uId);

}
