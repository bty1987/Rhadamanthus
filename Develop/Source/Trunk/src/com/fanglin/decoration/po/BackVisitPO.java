/**
 * @FileName	: CityPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */
package com.fanglin.decoration.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "backVisit", catalog = "platform")
public class BackVisitPO implements Serializable {

	private static final long serialVersionUID = 1000000000011112L;
	
	public static final String COLUMN_ORDERID_STR = "decorationOrder.orderId";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";

	private long bvId;

	private DecorationOrderPO decorationOrder;

	private UserPO sender;
	
	private String receiverIds;
	
	private Timestamp createTime;
	
	private String content;

	@Id
	@GeneratedValue
	public long getBvId() {
		return bvId;
	}

	public void setBvId(long bvId) {
		this.bvId = bvId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationOrderPO getDecorationOrder(){
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderPO decorationOrder) {
		this.decorationOrder = decorationOrder;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "senderId", referencedColumnName = "userId")
	public UserPO getSender() {
		return sender;
	}

	public void setSender(UserPO sender) {
		this.sender = sender;
	}

	public String getReceiverIds() {
		return receiverIds;
	}

	public void setReceiverIds(String receiverIds) {
		this.receiverIds = receiverIds;
	}

	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}
