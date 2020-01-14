/**
 * @File Name		: VprizeDao.java
 * @Package   	: com.fanglin.information.dao
 * @Version		: 1.0
 * @Date			: 2019-4-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.VprizePO;
import com.fanglin.utils.Paging;

public interface VprizeDao extends Dao<VprizePO> {
	
	public List<VprizePO> pageVprize(Paging paging, List<Filter> filters);
	
	public List<VprizePO> queryVprize(long vaid);
	
	public int updateVprizeStatusForFailure(long vaid);

}
