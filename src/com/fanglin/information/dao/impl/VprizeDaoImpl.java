/**
 * @File Name		: VprizeDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2019-4-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.VprizeDao;
import com.fanglin.information.po.VprizePO;
import com.fanglin.utils.Paging;

@Repository("vprizeDao")
public class VprizeDaoImpl extends DaoImpl<VprizePO> implements VprizeDao {
	
	public VprizeDaoImpl(){
		super(VprizePO.class);
	}
	
	@Override
	public List<VprizePO> pageVprize(Paging paging, List<Filter> filters) {
		
		PagingQuery<VprizePO> query = pagingQuery(paging, VprizePO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<VprizePO> queryVprize(long vaid) {
		return session().createCriteria(VprizePO.class).add(Restrictions.eq("vaid", vaid)).list();
	}
	
	@Override
	public int updateVprizeStatusForFailure(long vaid) {
		
		String sql = "update information.vprize set status = :status where vaid = :vaid";
		session().createSQLQuery(sql).setShort("status", VprizePO.STATUS_INVALID_INT).setLong("vaid", vaid).executeUpdate();
		
		return 0;
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for (Filter filter : filters) {
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals("name")){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals("status")){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}
			}
		}
		
	}

}
