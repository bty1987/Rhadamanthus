/**
 * @File Name		: DecorationStatusRightDao.java
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
import com.fanglin.right.po.DecorationStatusRightPO;

public interface DecorationStatusRightDao extends Dao<DecorationStatusRightPO> {

	public List<DecorationStatusRightPO> queryDecorationStatusRight(int uId, int company);

	public int syncDecorationStatusRight(int uid, List<Integer> companys, int company);

	public int deleteDecorationStatusRight(int uid, int company);

	public int deleteDecorationStatusRight(int uid, List<Integer> companys);

}
