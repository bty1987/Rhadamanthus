/**
 * @File Name		: DecorationAuditScaleDao.java
 * @Package   	: com.fanglin.decoration.dao
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
import com.fanglin.decoration.po.DecorationAuditScalePO;

public interface DecorationAuditScaleDao extends Dao<DecorationAuditScalePO>{

	List<DecorationAuditScalePO> queryDecorationAuditScaleByArid(Long arid);

}
