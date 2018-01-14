/**
 * @File Name		: AddReduceItemService.java
 * @Package   	: com.fanglin.decoration.service
 * @Version		: 1.0
 * @Date			: 2016-6-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.AuditScalePO;

public interface AuditScaleDao extends Dao<AuditScalePO>{

	List<AuditScalePO> queryAudtiScaleByArid(Long arid);

}
