/**
 * @File Name		:  ActionLogDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.log.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.utils.Paging;

public interface ActionLogDao extends Dao<ActionLogPO> {

	List<ActionLogPO> getPageActionLogPOs(Paging paging, List<Filter> filters);

	List<ActionLogPO> getAllPageActionLogPOs(List<Filter> filters);
	
}
