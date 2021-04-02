/**
 * @File Name		: ActivityDao.java
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
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.utils.Paging;

public interface ActivityDao extends Dao<ActivityPO> {

	public List<ActivityPO> pageActivity(Paging paging, List<Filter> filters, int company);

	public List<ActivityPO> queryActivityForValid(int company, short type);

	public ActivityPO queryActivityForDefault(int company, short type);

	public int resetActivityForDefault(short type,int company);

}
