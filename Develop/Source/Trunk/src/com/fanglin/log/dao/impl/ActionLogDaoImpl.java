/**
 * @File Name		: ActionLogDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.log.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.log.dao.ActionLogDao;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("actionLogDao")
public class ActionLogDaoImpl extends DaoImpl<ActionLogPO> implements ActionLogDao {

	public ActionLogDaoImpl(){
		super(ActionLogPO.class);
	}

	@Override
	public List<ActionLogPO> getPageActionLogPOs(Paging paging, List<FilterVO> filters){
		PagingQuery<ActionLogPO> query = pagingQuery(paging, ActionLogPO.class);
		
		queryFilterExcute(query, filters);
		
		query.desc("createTime");
		
		return query.list();
	}

	@Override
	public List<ActionLogPO> getAllPageActionLogPOs(List<FilterVO> filters){
		
		PagingQuery<ActionLogPO> query = pagingQuery(new Paging(), ActionLogPO.class);
		
		queryFilterExcute(query, filters);
		
		query.desc("createTime");
		query.notPaging();
		
		return query.list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		if(filters != null){
			query.alias("createUserPO", "createUserPO");
			
			for(FilterVO filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if(StringUtils.isNotEmpty(data)){
					if("createTime".equals(field)){
						if("between".equals(op)){

							String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
							String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

							Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
							Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

							Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
							Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

							query.add(getCriterion("createTime", eTimestamp, "le"));
							query.add(getCriterion("createTime", sTimestamp, "ge"));
						}else{
							query.add(getCriterion("createTime", data, op));
						}
					}else if("createUser".equals(field)){
						query.add(getCriterion("createUserPO.currentName", (data), op));
					}else if("createUserId".equals(field)){
						query.add(getCriterion("createUserPO.userId", (data), op));
					}else{
						query.add(query.getCriterion(field, (data), op));
					}
				}
			}
		}
	}
}
