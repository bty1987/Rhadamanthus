/**
 * @File Name		: SubjectDao.java
 * @Package   	: com.fanglin.finance.dao
 * @Version		: 1.0
 * @Date			: 2015-11-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.po.SubjectPO;
import com.fanglin.utils.Paging;

public interface SubjectDao  extends Dao<SubjectPO> {
	
	public List<SubjectPO> pageSubject(Paging paging, List<Filter> filters);
	
	public List<SubjectPO> querySubject();
	
	public List<SubjectPO> querySubjectByNameOCode(String name, String code);
	
	public SubjectPO querySubjectByCode(String code);

}
