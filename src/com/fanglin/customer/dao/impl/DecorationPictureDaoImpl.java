package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationPictureDao;
import com.fanglin.decoration.po.DecorationPicturePO;
import com.fanglin.utils.Paging;

@Repository("decorationPictureOrderDao")
public class DecorationPictureDaoImpl extends DaoImpl<DecorationPicturePO> implements DecorationPictureDao {

	public DecorationPictureDaoImpl() {
		super(DecorationPicturePO.class);
	}

	@Override
	public List<DecorationPicturePO> queryCusDecorationPicture(Paging paging, List<Filter> filters, String orderId) {

		PagingQuery<DecorationPicturePO> query = pagingQuery(paging, DecorationPicturePO.class);

		query.add(query.getCriterion("orderId", orderId, "eq"));

		// 查询 status=0(显示) 或 status=4(确认) 的图片
		query.add(Restrictions.in(DecorationPicturePO.COLUMN_STATUS_STR,
				new Short[] {
					DecorationPicturePO.STATUS_DISABLE_INT,
					DecorationPicturePO.STATUS_CONFIRM_SHOW_INT
				}));

		return query.list();
	}

}
