/**
 * @File Name		: ActivityItemDao.java
 * @Package   	: com.fanglin.information.dao
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.information.po.ActivityItemPO;

public interface ActivityItemDao extends Dao<ActivityItemPO> {

	public List<ActivityItemPO> queryActivityItemByAid(long aId);

	public List<ActivityItemPO> queryActivityItemByAsid(long asid);

	/**
	 * 该活动的阶梯奖品行(type=30, 面值降序由调用方排序)
	 */
	public List<ActivityItemPO> queryActivityItemForLadder(long aId);

}
