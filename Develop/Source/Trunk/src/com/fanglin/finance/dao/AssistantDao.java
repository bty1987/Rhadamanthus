/**
 * @File Name		: AssistantDao.java
 * @Package   	: com.fanglin.finance.dao
 * @Version		: 1.0
 * @Date			: 2015-11-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.finance.po.AssistantPO;

public interface AssistantDao extends Dao<AssistantPO> {

	public AssistantPO merge(AssistantPO assistantPO);

}
