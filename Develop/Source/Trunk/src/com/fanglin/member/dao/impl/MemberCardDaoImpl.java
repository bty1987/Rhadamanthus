package com.fanglin.member.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.member.po.MemberCardPO;
import com.fanglin.member.dao.MemberCardDao;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("memberCardDao")
public class MemberCardDaoImpl extends DaoImpl<MemberCardPO> implements MemberCardDao {

	public MemberCardDaoImpl() {
		super(MemberCardPO.class);
	}
	
	@Override
	public MemberCardPO queryMemberCardByOrderId(String orderId) {
		return (MemberCardPO) session().createCriteria(MemberCardPO.class).add(Restrictions.eq("orderId", String.valueOf(orderId))).uniqueResult();
	}
	
	@Override
	public MemberCardPO queryMemberCardByMcId(long mcId) {
		return (MemberCardPO) session().createCriteria(MemberCardPO.class).add(Restrictions.eq("mcId", mcId)).uniqueResult();
	}
	
	@Override
	public MemberCardPO queryMemberCardByNo(String no) {
		
		return (MemberCardPO) session().createCriteria(MemberCardPO.class).add(Restrictions.eq("no", no)).uniqueResult();
	}
	
	@Override
	public List<MemberCardPO> pageMemberCard(Paging paging, List<Filter> filters) {

		PagingQuery<MemberCardPO> query = pagingQuery(paging, MemberCardPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){

		if(filters != null && filters.size() > 0){

			for(Filter filter: filters){

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if("orderId".equals(field)){
					query.add(query.getCriterion(MemberCardPO.COLUMN_ORDERID_STR, data, op));
				}else if("createTime".equals(field)){
					if("between".equals(filter.getOp())){
						
						String sTime = filter.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
						String eTime = filter.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";
						
						Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
						Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
						
						Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
						Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
						
						query.add(query.getCriterion(MemberCardPO.COLUMN_CREATETIME_STR, eTimestamp, "le"));
						query.add(query.getCriterion(MemberCardPO.COLUMN_CREATETIME_STR, sTimestamp, "ge"));
					}else{
						query.add(query.getCriterion(MemberCardPO.COLUMN_CREATETIME_STR, filter.getData(), filter.getOp()));
					}
				}
				
			}
		}
	}

}
