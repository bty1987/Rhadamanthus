/**
 * @File Name	: DecorationOrderDrawLineDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date		: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email		: 
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("decorationOrderDrawLineDao")
public class DrawLineDaoImpl extends DaoImpl<DrawLinePO> implements DrawLineDao {

	public DrawLineDaoImpl(){
		super(DrawLinePO.class);
	}
	
	@Override
	public List<DrawLinePO> pageDrawLine(Paging paging, List<Filter> filters, Integer company){

		PagingQuery<DrawLinePO> query = pagingQuery(paging, DrawLinePO.class);
		
		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.asc("actualStartTime");
		
		return query.list();
	}
	
	@Override
	public List<DrawLinePO> queryDrawLine(List<Filter> filters, Integer company) {

		PagingQuery<DrawLinePO> query = pagingQuery(new Paging(), DrawLinePO.class);
		
		query.add(query.getCriterion("decoration.company", company, "eq"));
		queryFilterExcute(query, filters);

		query.notPaging();
		
		return query.list();
	}

	
	@Override
	@SuppressWarnings("unchecked")
	public List<DrawLinePO> queryDrawLine(Timestamp startTime, Timestamp endTime, Integer company){
		
		List<Short> status = Arrays.asList(new Short[]{DrawLinePO.DRAWLINE_STATUS_FAIL_SHORT, DrawLinePO.DRAWLINE_STATUS_QUEUE_SHORT});
			
			return (List<DrawLinePO>)createCriteria(DrawLinePO.class)
					
					.createAlias("decoration", "decoration")
					
					.add(Restrictions.eq("decoration.company", company))
		
					.add(Restrictions.not(Restrictions.in("status", status)))
		
					.add(Restrictions.ge("actualStartTime", startTime))
		
					.add(Restrictions.le("actualStartTime", endTime))
					
					.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DrawLinePO> queryDrawLineByOrderId(String orderId){
		return createCriteria(DrawLinePO.class)

				.add(Restrictions.eq("decoration.orderId", orderId))

				.addOrder(Order.desc("dlId"))
				
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DrawLinePO> queryDrawLineByGroupATime(long gid, Timestamp startTime,Timestamp endTime, Integer company){
		
		List<Short> status = Arrays.asList(new Short[]{DrawLinePO.DRAWLINE_STATUS_FAIL_SHORT, DrawLinePO.DRAWLINE_STATUS_QUEUE_SHORT});
		
		return (List<DrawLinePO>)createCriteria(DrawLinePO.class)
				.createAlias("decoration", "decoration")
				.createAlias("drawLineGroup", "drawLineGroup")
				.add(Restrictions.eq("decoration.company", company))
				.add(Restrictions.eq("drawLineGroup.gid", gid))
				.add(Restrictions.not(Restrictions.in("status", status)))
				.add(Restrictions.or(
						Restrictions.or(
							Restrictions.or(
									
									Restrictions.or(
											Restrictions.and(Restrictions.gt("actualStartTime", startTime),Restrictions.lt("actualStartTime", endTime)),
											Restrictions.and(Restrictions.gt("actualEndTime", startTime),Restrictions.lt("actualEndTime", endTime))),
											Restrictions.and(Restrictions.lt("actualStartTime", startTime),Restrictions.gt("actualEndTime", startTime))),
									Restrictions.and(Restrictions.eq("actualStartTime", startTime),Restrictions.eq("actualEndTime", endTime))			
							
						),

						Restrictions.and(Restrictions.gt("actualStartTime", endTime),Restrictions.lt("actualEndTime", endTime)))).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		if(filters != null){

			query.alias("decoration", "decoration");
			query.alias("decoration.house", "house");
			query.alias("decoration.designer", "designer");
			query.alias("decoration.salesman", "salesman");
			
			query.alias("house.village", "village");
			query.alias("designer.dept", "designerDept");
			query.alias("salesman.dept", "salesmanDept");
			
			for(Filter filter: filters){

				if(StringUtils.isNotEmpty(filter.getData())){
					if("orderId".equals(filter.getField())){
						query.add(query.getCriterion("decoration.orderId",(filter.getData()), filter.getOp()));
					}else if("village".equals(filter.getField())){
						query.add(query.getCriterion("village.no", (filter.getData()), filter.getOp()));
					}else if("drawLineGroupName".equals(filter.getField())){
						query.add(query.getCriterion("drawLineGroupName", (filter.getData()), filter.getOp()));
					}else if("businessDepartment".equals(filter.getField())){				
						query.add(query.getCriterion("salesmanDept.name", (filter.getData()), filter.getOp()));
					}else if("designDepartment".equals(filter.getField())){
						query.add(query.getCriterion("designerDept.name", (filter.getData()), filter.getOp()));
					}else if("businessDepartmentId".equals(filter.getField())){				
						query.add(query.getCriterion("salesmanDept.no", (filter.getData()), filter.getOp()));
					}else if("designDepartmentId".equals(filter.getField())){
						query.add(query.getCriterion("designerDept.no", (filter.getData()), filter.getOp()));
					}else if("salesman".equals(filter.getField())){
						query.add(query.getCriterion("salesman.userId", (filter.getData()), filter.getOp()));
					}else if("designer".equals(filter.getField())){
						query.add(query.getCriterion("designer.userId", (filter.getData()), filter.getOp()));
					}else if("status".equals(filter.getField())){
						query.add(query.getCriterion("status", ((short)Integer.parseInt(filter.getData())), filter.getOp()));
						
					}else if("actualDate".equals(filter.getField())){
						
						if("between".equals(filter.getOp())){
							String sTime = filter.getData() + " 00:00:00";
				            String eTime = filter.getData() + " 23:59:59";

				            Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				            Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

				            Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				            Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
							query.add(query.getCriterion("actualStartTime", sTimestamp, "ge"));
							query.add(query.getCriterion("actualStartTime", eTimestamp, "le"));
						}else{
							query.add(query.getCriterion("actualStartTime", filter.getData(), filter.getOp()));
						}
					}else {
						query.add(query.getCriterion(filter.getField(),(filter.getData()), filter.getOp()));
					}
				}
			}
		}
	}
}
