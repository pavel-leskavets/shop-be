create table product_list (
	id uuid primary key default uuid_generate_v4(),
    title text default 'Some title',
    description text,
    img_url text,
    price integer
)

create table stock_list (
	count integer,
	product_id uuid,
	foreign key ("product_id") references "product_list" ("id")
)

insert into product_list (title, description, img_url, price) values
	('Elixir of life', 'Prolongs human life indefinitely', 'https://i.pinimg.com/originals/d4/c2/23/d4c223f6772abb00c5d8f930b662b58e.jpg', 777),
	('Felix Felicis', 'Gives temporary luck', 'https://fb.ru/misc/i/thumb/a/1/1/0/7/8/6/2/1107862.jpg', 567),
	('Polyjuice Potion', 'Changes your appearance', 'https://h5j4s3b8.rocketcdn.me/wp-content/uploads/2013/07/Polyjuice-Potion2.jpg', 135),
	('Veritaserum', 'Makes you tell the truth', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ab0c6cf2-7258-49d9-adde-243d75c08bc5/d4837nf-73a93e92-3ef9-4801-a2a9-240ad0bdeeea.jpg/v1/fill/w_900,h_600,q_75,strp/veritaserum_by_reyvolution_d4837nf-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD02MDAiLCJwYXRoIjoiXC9mXC9hYjBjNmNmMi03MjU4LTQ5ZDktYWRkZS0yNDNkNzVjMDhiYzVcL2Q0ODM3bmYtNzNhOTNlOTItM2VmOS00ODAxLWEyYTktMjQwYWQwYmRlZWVhLmpwZyIsIndpZHRoIjoiPD05MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.yxGRPmv-bkiftjYKKCinLKqq2rsbeSmmMsjfeAsFpI8', 442),
	('Invisibility Potion', 'Makes you invisible', 'https://i.pinimg.com/originals/28/6b/e3/286be30098ae2f2c5a6eeebf508ba005.jpg', 239),
	('Skele-Gro', 'Leads to recovery lost bones', 'https://i.etsystatic.com/12412609/r/il/aaba43/1056622142/il_570xN.1056622142_7oap.jpg', 322),
	('Wolfsbane Potion', 'Helps to muffle lycanthropy', 'https://i.etsystatic.com/7609576/r/il/0b84bb/1989919455/il_570xN.1989919455_tero.jpg', 593),
	('Amortentia Love Potion', 'Invokes intensive artificial love', 'https://i.pinimg.com/originals/81/04/b1/8104b17ec580ca9bf2813393e83fc482.jpg', 13),
	('Draught of Living Death', 'Strong sedative', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/dfebdd90-f50b-408f-ae94-44d57cfd5cfc/d5jdj1b-3400a766-cfb7-4361-9b31-a32e4c777c7d.jpg/v1/fill/w_900,h_856,q_75,strp/draught_of_living_death_by_spoon333_d5jdj1b-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD04NTYiLCJwYXRoIjoiXC9mXC9kZmViZGQ5MC1mNTBiLTQwOGYtYWU5NC00NGQ1N2NmZDVjZmNcL2Q1amRqMWItMzQwMGE3NjYtY2ZiNy00MzYxLTliMzEtYTMyZTRjNzc3YzdkLmpwZyIsIndpZHRoIjoiPD05MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.9Pa3UUxBaledn-X_g_KiKFczPQdhMILP7CcMrfFf_pw', 368)
	
insert into stock_list (product_id, count) values
	('ba9ab42e-46ec-4c38-b38f-1d9fd33eab98', 123),
	('e1149c1c-9cc9-4b82-af5b-064a55d459d8', 45),
	('4391c4d6-9a0c-4e48-b056-60291278e020', 345),
	('3c521f96-b136-4706-b61c-6ef67d16d4a3', 947),
	('0412d92f-9a57-414e-8d7a-5eac7d3dee39', 39),
	('18a0cd07-6adc-4348-af42-18ffa3814582', 442),
	('d817e239-512d-472f-bf04-3ef788ea7967', 983),
	('f54e6409-d647-4c37-83bd-90f0cf7327de', 394),
	('9f1ba6cf-e626-4a0f-81cc-d95cf16a31a6', 777)