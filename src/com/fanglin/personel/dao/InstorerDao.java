/**
 * @File Name		: InstorerDao.java
 * @Package   	: com.fanglin.personel.dao
 * @Version		: 1.0
 * @Date			: 2019-10-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Paging;

public interface InstorerDao extends Dao<UserPO> {

	public List<UserPO> pageInstorer(Paging paging, List<Filter> filters, int company);

	public List<UserPO> queryInstorerByPinyin(String pinyin, int company) throws FLException;

	public int countInstorerByCompany(int company);

}
