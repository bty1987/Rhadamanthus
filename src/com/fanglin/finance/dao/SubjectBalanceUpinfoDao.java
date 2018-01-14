/**
 * @File Name		: SubjectBalanceUpinfoDao.java
 * @Package   	: com.fanglin.finance.dao
 * @Version		: 1.0
 * @Date			: 2016-4-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.finance.po.SubjectBalanceUpinfoPO;

public interface SubjectBalanceUpinfoDao extends Dao<SubjectBalanceUpinfoPO> {
	
	public List<SubjectBalanceUpinfoPO> querySubjectBalanceUpinfoForInit();

}
