package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.MemberDetailDao;
import com.fanglin.information.po.MemberDetailPO;
import com.fanglin.utils.Paging;

@Repository("memberDetailDao")
public class MemberDetailDaoImpl extends DaoImpl<MemberDetailPO> implements MemberDetailDao {
	
	public MemberDetailDaoImpl() {
		super(MemberDetailPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MemberDetailPO> queryMemberDetailByMcId(long mcId) {
		return session().createCriteria(MemberDetailPO.class).add(Restrictions.eq("memberCard.mcId", mcId)).list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MemberDetailPO> queryMemberDetailByMcIdForSubType(long mcId) {
		 
		return session().createCriteria(MemberDetailPO.class).add(Restrictions.eq("memberCard.mcId", mcId)).add(Restrictions.eq("subType", MemberDetailPO.SUBTYPE_PLUS_INT)).addOrder(Order.asc("multiple")).list();
	}
	
	@Override
	public List<MemberDetailPO> pageMemberDetail(Paging paging, List<Filter> filters) {

		PagingQuery<MemberDetailPO> query = pagingQuery(paging, MemberDetailPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){

		if(filters != null && filters.size() > 0){

			for(Filter filter: filters){

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if("mcId".equals(field)){
					query.add(query.getCriterion("memberCard.mcId", Long.valueOf(data), op));
				}
			}
		}
	}

}
